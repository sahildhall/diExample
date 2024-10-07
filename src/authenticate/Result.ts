
export class Result {
    private status: number;
    private data: any;
    private errData: any;

    constructor(status: number, data: any, errObj: any) {
        this.status = status;
        this.data = data;

        if (errObj) {
            this.errData = {message: undefined, code: undefined};
            if (typeof errObj === 'string') {
                this.errData.message = errObj;
                this.errData.code = 422;
            } else {
                this.errData.message = errObj.message || 'Some Error';
                this.errData.code = errObj.status || '';
            }
        }
        return this;
    }
}
