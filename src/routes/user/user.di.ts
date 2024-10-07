import { Container } from "inversify";
import { UserController, UserRoutes} from './';

export class UserDi {
    public static registerDI(container: Container, symbols: any) {
        container.bind<UserController>(symbols.UserController).to(UserController);
        container.bind<UserRoutes>(symbols.UserRoutes).to(UserRoutes);
    }
};
