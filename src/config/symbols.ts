import {ProductRoutes} from "../routes/product";

export interface MembershipSymbols {
    Util: symbol;

    ApiKeyCheck: symbol;
    Bootstrap: symbol;
    MiddlewaresValidateBody: symbol;

    ProductController: symbol;
    ProductRoutes: symbol;

    UserController: symbol;
    UserRoutes: symbol;
}

export const Symbols: MembershipSymbols = {
    Util: Symbol('Util'),
    ApiKeyCheck: Symbol('ApiKeyCheck'),
    Bootstrap: Symbol('Bootstrap'),
    MiddlewaresValidateBody: Symbol('MiddlewaresValidateBody'),

    ProductController: Symbol('ProductController'),
    ProductRoutes: Symbol('ProductRoutes'),

    UserController: Symbol('UserController'),
    UserRoutes: Symbol('UserRoutes'),
};