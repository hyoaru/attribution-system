export const DI = {
  UserRepositoryInterface: Symbol.for("UserRepositoryInterface"),
  AuthenticationRepositoryInterface: Symbol.for(
    "AuthenticationRepositoryInterface",
  ),
  DocumentRepositoryInterface: Symbol.for("DocumentRepositoryInterface"),
  AttributionRepositoryInterface: Symbol.for("AttributionRepositoryInterface"),
  AuthenticationServiceInterface: Symbol.for("AuthenticationServiceInterface"),
  DocumentServiceInterface: Symbol.for("DocumentServiceInterface"),
  AttributionServiceInterface: Symbol.for("AttributionServiceInterface"),
  MlApiClientInterface: Symbol.for("MlApiClientInterface"),
};
