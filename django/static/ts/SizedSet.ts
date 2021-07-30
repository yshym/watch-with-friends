import Serializable from "./Serializable";

export default class SizedSet<T> implements Serializable {
    n: number;
    set_: Set<T>;

    constructor(n: number, initialValues: Iterable<T> | null = null) {
        this.set_ = new Set(initialValues);
        this.n = n;
    }

    prepend = (item: T): boolean => {
        let arr = Array.from(this.set_);

        if (arr.length > 0 && arr[0] === item) {
            return false;
        }

        if (this.set_.size >= this.n) {
            arr.shift();
        }

        arr.unshift(item);
        this.set_ = new Set(arr);

        return true;
    };

    toJSON = () => JSON.stringify(Array.from(this.set_));

    static fromJSON = <DT>(n: number, str: string): SizedSet<DT> =>
        new SizedSet(n, JSON.parse(str));
}
