import * as React from 'react';
interface Props {
    children?: React.ReactNode;
}
export interface IWindowContext extends Window {
}
export declare const WindowContext: React.Context<IWindowContext>;
export declare function WindowContextProvider(props: Props): JSX.Element;
export declare function useWindow(): (Window & typeof globalThis) | undefined;
export {};
