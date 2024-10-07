import { Container } from "inversify";
import { ProductController, ProductRoutes} from './';

export class ProductDi {
    public static registerDI(container: Container, symbols: any) {
        container.bind<ProductController>(symbols.ProductController).to(ProductController);
        container.bind<ProductRoutes>(symbols.ProductRoutes).to(ProductRoutes);
    }
};
