module Syntax where

{--|
  This is just a bunch of stuff from the PS compiler that will come in handy
--}


literalToJSON :: (a -> Value) -> Literal a -> Value
literalToJSON _ (NumericLiteral (Left n)) = toJSON ("IntLiteral", n)
literalToJSON _ (NumericLiteral (Right n)) = toJSON ("NumberLiteral", n)
literalToJSON _ (StringLiteral s) = toJSON ("StringLiteral", s)
literalToJSON _ (CharLiteral c) = toJSON ("CharLiteral", c)
literalToJSON _ (BooleanLiteral b) = toJSON ("BooleanLiteral", b)
literalToJSON t (ArrayLiteral xs) = toJSON ("ArrayLiteral", map t xs)
literalToJSON t (ObjectLiteral xs) = toJSON ("ObjectLiteral", recordToJSON t xs)



binderToJSON :: Binder a -> Value
binderToJSON (VarBinder _ v)              = toJSON ( "VarBinder"
                                                   , identToJSON v
                                                   )
binderToJSON (NullBinder _)               = toJSON "NullBinder"
binderToJSON (LiteralBinder _ l)          = toJSON ( "LiteralBinder"
                                                   , literalToJSON binderToJSON l
                                                   )
binderToJSON (ConstructorBinder _ d c bs) = toJSON ( "ConstructorBinder"
                                                   , qualifiedToJSON runProperName d
                                                   , qualifiedToJSON runProperName c
                                                   , map binderToJSON bs
                                                   )
binderToJSON (NamedBinder _ n b)          = toJSON ( "NamedBinder"
                                                   , identToJSON n
                                                   , binderToJSON b
                                                   )


data Expr a
  -- |
  -- A literal value
  --
  = Literal a (Literal (Expr a))
  -- |
  -- A data constructor (type name, constructor name, field names)
  --
  | Constructor a (ProperName 'TypeName) (ProperName 'ConstructorName) [Ident]
  -- |
  -- A record property accessor
  --
  | Accessor a PSString (Expr a)
  -- |
  -- Partial record update
  --
  | ObjectUpdate a (Expr a) [(PSString, Expr a)]
  -- |
  -- Function introduction
  --
  | Abs a Ident (Expr a)
  -- |
  -- Function application
  --
  | App a (Expr a) (Expr a)
  -- |
  -- Variable
  --
  | Var a (Qualified Ident)
  -- |
  -- A case expression
  --
  | Case a [Expr a] [CaseAlternative a]
  -- |
  -- A let binding
  --
  | Let a [Bind a] (Expr a)
  deriving (Show, Functor)
