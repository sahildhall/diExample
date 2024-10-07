import "reflect-metadata";
import {Container} from 'inversify';
import {Bootstrap} from '../bootstarp';
import {Symbols} from './symbols';
import {ProductDi} from '../routes/product';
import {UserDi} from '../routes/user';
import {Util} from '../lib/util';
import {ApiKeyCheck} from '../authenticate/apiKeyCheck';
import {MiddlewaresValidateBody} from '../middlewares/middlewares.validateBody';

const container = new Container();

ProductDi.registerDI(container, Symbols);
UserDi.registerDI(container, Symbols);

container.bind<Bootstrap>(Symbols.Bootstrap).to(Bootstrap);
container.bind<MiddlewaresValidateBody>(Symbols.MiddlewaresValidateBody).to(MiddlewaresValidateBody);
container.bind<Util>(Symbols.Util).to(Util);
container.bind<ApiKeyCheck>(Symbols.ApiKeyCheck).to(ApiKeyCheck);

export default container;
