export default function Heading({ level, children }) {
    switch (level){
        case 1:
            return <h1>{children}</h1>;
        case 2:
            return <h2>{children}</h2>;
        case 3:
            return <h3>{children}</h3>;
        default:
            throw new Error('不支持的级别:' + level);
    }
}