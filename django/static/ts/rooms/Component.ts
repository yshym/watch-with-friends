export default abstract class Component {
    abstract createElement: () => HTMLElement;
    abstract mount: () => void;
}
