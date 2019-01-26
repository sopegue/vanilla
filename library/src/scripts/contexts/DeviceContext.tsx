/*
 * @author Stéphane LaFlèche <stephane.l@vanillaforums.com>
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import * as React from "react";
import { Optionalize } from "@library/@types/utils";
import throttle from "lodash/throttle";
import { Devices, IDeviceProps } from "@library/components/DeviceChecker";

const DeviceContext = React.createContext<Devices>(Devices.DESKTOP);
export default DeviceContext;

interface IProps {
    children: React.ReactNode;
}

interface IState {
    device: Devices;
}
export class DeviceProvider extends React.Component<IProps, IState> {
    public state: IState = {
        device: Devices.DESKTOP,
    };
    private deviceChecker: React.RefObject<HTMLDivElement> = React.createRef();

    public render() {
        return (
            <>
                <div ref={this.deviceChecker} className="deviceChecker" />;
                <DeviceContext.Provider value={this.state.device}>{this.props.children}</DeviceContext.Provider>
            </>
        );
    }

    /**
     * Query div in page to get device based on media query from CSS
     */
    private get device() {
        if (this.deviceChecker.current) {
            let device = Devices.DESKTOP;
            switch (`${this.deviceChecker.current.offsetWidth}`) {
                case "1":
                    device = Devices.MOBILE;
                    break;
                case "2":
                    device = Devices.TABLET;
                    break;
                case "3":
                    device = Devices.NO_BLEED;
                    break;
                default:
                    device = Devices.DESKTOP;
            }
            return device;
        } else {
            throw new Error("deviceChecker does not exist");
        }
    }

    /**
     * There's a bug in webpack and there's no way to know the styles have loaded from webpack. In debug mode,
     */
    public componentDidMount() {
        window.addEventListener("resize", this.throttledUpdateOnResize);
        if (module.hot) {
            setTimeout(() => {
                window.dispatchEvent(new Event("resize"));
            }, 1000);
        }
    }

    /**
     * @inheritDoc
     */
    public componentWillUnmount() {
        window.removeEventListener("resize", this.throttledUpdateOnResize);
    }

    /**
     * A throttled version of updateOnResize.
     */
    private throttledUpdateOnResize = throttle(
        () => {
            this.setState({ device: this.device });
        },
        100,
        {
            leading: false,
        },
    );
}

/**
 * HOC to inject DeviceContext as props.
 *
 * @param WrappedComponent - The component to wrap
 */
export function withDevice<T extends IDeviceProps = IDeviceProps>(WrappedComponent: React.ComponentType<T>) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
    const ComponentWithDevice = (props: Optionalize<T, IDeviceProps>) => {
        return (
            <DeviceContext.Consumer>
                {context => {
                    return <WrappedComponent device={context} {...props} />;
                }}
            </DeviceContext.Consumer>
        );
    };
    ComponentWithDevice.displayName = `withDevice(${displayName})`;
    return ComponentWithDevice;
}
