"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteContextProvider = exports.useRemoteContext = exports.RemoteContext = void 0;
const React = __importStar(require("react"));
const WindowContextProvider_1 = require("../window/WindowContextProvider");
function createRemoteContext(windowContext) {
    function postj(path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield windowContext.fetch(path, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body || {})
            });
            const resContentType = res.headers.get('content-type');
            if (resContentType &&
                (resContentType.indexOf('application/json') >= 0 ||
                    resContentType.indexOf('text/json') >= 0)) {
                return yield res.json();
            }
            else {
                return Promise.reject('Response is not json type');
            }
        });
    }
    function getj(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield windowContext.fetch(path, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const resContentType = res.headers.get('content-type');
            if (resContentType &&
                (resContentType.indexOf('application/json') >= 0 ||
                    resContentType.indexOf('text/json') >= 0)) {
                return yield res.json();
            }
            else {
                return Promise.reject('Response is not json type');
            }
        });
    }
    return {
        postj,
        getj,
        fetch: typeof window !== 'undefined' ? windowContext.fetch : undefined
    };
}
exports.RemoteContext = React.createContext(undefined);
function useRemoteContext() {
    return React.useContext(exports.RemoteContext);
}
exports.useRemoteContext = useRemoteContext;
function RemoteContextProvider(props) {
    const windowContext = WindowContextProvider_1.useWindow();
    console.log("?? windiw cotext ", windowContext);
    const remoteContextRef = React.useRef(createRemoteContext(windowContext));
    return (React.createElement(exports.RemoteContext.Provider, { value: remoteContextRef.current }, props.children));
}
exports.RemoteContextProvider = RemoteContextProvider;
