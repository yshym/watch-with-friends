export default interface Serializable {
    toJSON: () => string;
}
