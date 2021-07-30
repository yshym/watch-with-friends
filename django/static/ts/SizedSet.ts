import Serializable from "./Serializable";

export default class SizedSet<T> implements Serializable {
    n: number;
    set_: Set<T>;

    constructor(n: number, initialValues: Iterable<T> | null = null) {
        this.set_ = new Set(initialValues);
        this.n = n;
    }

    add = (item: T): this => {
        if (this.set_.size < this.n) {
            this.set_.add(item);
        } else {
            let arr = Array.from(this.set_);
            arr.shift();
            arr.unshift(item);

            this.set_ = new Set(arr);
        }

        return this;
    };

    toJSON = () => JSON.stringify(Array.from(this.set_));

    static fromJSON = <DT>(n: number, str: string): SizedSet<DT> =>
        new SizedSet(n, JSON.parse(str));
}
