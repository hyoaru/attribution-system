import { Container } from "inversify";
import { AttributionRepository } from "../../repositories/AttributionRepository/AttributionRepository";
import { AttributionRepositoryInterface } from "../../repositories/AttributionRepository/Interface";
import { AuthenticationRepository } from "../../repositories/AuthenticationRepository/AuthenticationRepository";
import { AuthenticationRepositoryInterface } from "../../repositories/AuthenticationRepository/Interface";
import { DocumentRepository } from "../../repositories/DocumentRepository/DocumentRepository";
import { DocumentRepositoryInterface } from "../../repositories/DocumentRepository/Interface";
import { UserRepositoryInterface } from "../../repositories/UserRepository/Interface";
import { UserRepository } from "../../repositories/UserRepository/UserRepository";
import { AttributionService } from "../../services/AttributionService/AttributionService";
import { AttributionServiceInterface } from "../../services/AttributionService/Interface";
import { AuthenticationService } from "../../services/AuthenticationService/AuthenticationService";
import { AuthenticationServiceInterface } from "../../services/AuthenticationService/Interface";
import { DocumentService } from "../../services/DocumentService/DocumentService";
import { DocumentServiceInterface } from "../../services/DocumentService/Interface";
import { MlApiClientInterface } from "../../utilities/MlApiClient/Interface";
import { MlApiClient } from "../../utilities/MlApiClient/MlApiService";
import { DI } from "./symbols";

const container = new Container();

container
  .bind<UserRepositoryInterface>(DI.UserRepositoryInterface)
  .to(UserRepository);

container
  .bind<AuthenticationRepositoryInterface>(DI.AuthenticationRepositoryInterface)
  .to(AuthenticationRepository);

container
  .bind<DocumentRepositoryInterface>(DI.DocumentRepositoryInterface)
  .to(DocumentRepository);

container
  .bind<AttributionRepositoryInterface>(DI.AttributionRepositoryInterface)
  .to(AttributionRepository);

container
  .bind<AuthenticationServiceInterface>(DI.AuthenticationServiceInterface)
  .to(AuthenticationService);

container
  .bind<DocumentServiceInterface>(DI.DocumentServiceInterface)
  .to(DocumentService);

container
  .bind<AttributionServiceInterface>(DI.AttributionServiceInterface)
  .to(AttributionService);

container.bind<MlApiClientInterface>(DI.MlApiClientInterface).to(MlApiClient);

export { container };
