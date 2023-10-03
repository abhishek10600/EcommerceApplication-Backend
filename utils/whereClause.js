//bigQ-//search=coder&page=2&category=shortssleeves&rating[gte]=4&price[lte]=999&price[gte]=199
class WhereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }
    search() {
        const searchWord = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: "i"
            }
        } : {

        }
        this.base = this.base.find({ ...searchWord })
        return this;
    }
}