import Serializable from "./Serializable";

export default class SizedSet<T> implements Serializable {
    maxSize: number;
    set_: Set<T>;

    constructor(maxSize: number, initialValues: Iterable<T> | null = null) {
        this.set_ = new Set(initialValues);
        this.maxSize = maxSize;
    }

    prepend = (item: T): boolean => {
        let arr = Array.from(this.set_);

        if (arr.length > 0 && arr[0] === item) {
            return false;
        }

        if (this.set_.size >= this.maxSize) {
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
