declare module '*.htm' {
    const content: string;
    export default content;
}

declare module '*.json' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}

declare module '*.md' {
    import Vue, { ComponentOptions, FunctionalComponentOptions } from 'vue';
    interface WithRender {
        <V extends Vue, U extends ComponentOptions<V> | FunctionalComponentOptions>(options: U): U;
        <V extends typeof Vue>(component: V): V;
    }
    const withRender: WithRender;
    export default withRender;
}
