import React from "react";
import dayjs from "dayjs";

import "./App.css";

type PropsType = {};
type tempType = {
    deviceId: string;
    temp: number;
    logId: string;
    humidity: number;
    tempDate: String;
    deviceDescription: string;
};
type Device = {
    deviceId: number;
    storeId: number;
    deviceDescription: string;
};
type StatesType = {
    mTemps: tempType[];
    mFilteredList: tempType[];
    deviceList: Device[];
    sort: string | null;
};
const DMSURL = "https://easytempserver-production.up.railway.app";

export default class App extends React.Component<PropsType, StatesType> {
    static defaultProps: PropsType = {};

    constructor(props: PropsType) {
        super(props);

        this.state = {
            mTemps: [],
            mFilteredList: [],
            deviceList: [],
            sort: null,
        };
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div
                        className="logo"
                        style={{ fontWeight: "bold", fontSize: "4rem" }}
                    >
                        <span style={{ color: "lightsalmon" }}>Easy</span>{" "}
                        <span style={{ color: "lightblue" }}>Temps</span>
                    </div>{" "}
                    <div
                        className="tempcontainer"
                        style={{
                            backgroundColor: "dimgray",
                            borderRadius: "10px",
                            marginTop: "40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <label htmlFor="deviceSelector">
                                Select Device ID:
                            </label>
                            <select
                                id="deviceSelector"
                                style={{
                                    height: "30px",
                                    width: "50px",
                                    marginLeft: "30px",
                                    textAlign: "center",
                                    fontSize: "1.4rem",
                                }}
                                onChange={(e) => {
                                    const selectedDevice = e.target.value;
                                    this.setState({ sort: selectedDevice });
                                }}
                            >
                                <option value="">All</option>
                                {this.state.deviceList.map((device, index) => (
                                    <option
                                        value={device.deviceId}
                                        key={device.deviceId}
                                    >
                                        {device.deviceId}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <table className="temp-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Device</th>
                                    <th>Description</th>
                                    <th>Temperature</th>
                                    <th>Humidity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.mFilteredList.map((temp, index) => (
                                    <tr
                                        key={temp.logId}
                                        className={
                                            index % 2 === 0
                                                ? "even-row"
                                                : "odd-row"
                                        }
                                    >
                                        <td>
                                            {dayjs(
                                                temp.tempDate.toString()
                                            ).format("MM/DD/YY hh:mm A")}
                                        </td>
                                        <td>{`Device ${temp.deviceId}`}</td>
                                        <td>{`Description ${temp.deviceDescription}`}</td>
                                        <td>{`Temperature ${temp.temp}`}</td>
                                        <td>{`Humidity ${temp.humidity}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </header>
            </div>
        );
    }

    componentDidUpdate(
        prevProps: Readonly<PropsType>,
        prevState: Readonly<StatesType>,
        snapshot?: any
    ): void {
        if (this.state.sort !== prevState.sort && this.state.sort !== null) {
            if (this.state.sort === "") {
                this.setState({ mFilteredList: this.state.mTemps });
            } else {
                const filteredList = this.state.mTemps.filter(
                    (temp) => temp.deviceId.toString() === this.state.sort
                );
                this.setState({ mFilteredList: filteredList });
            }
        }
        if (this.state.sort !== prevState.sort && this.state.sort === null) {
            this.setState({ mFilteredList: this.state.mTemps });
        }
    }

    async componentDidMount(): Promise<void> {
        try {
            const response = await fetch(DMSURL + `/temps/`, {
                method: "GET",
            });
            console.log(response); // Log the response
            const temps: tempType[] = await response.json();
            console.log(temps); // Log the prizes
            this.setState({ mTemps: temps, mFilteredList: temps });
        } catch (error) {
            console.error(error);
        }
        try {
            const response = await fetch(DMSURL + `/devices/`, {
                method: "GET",
            });
            console.log(response); // Log the response
            const devices: Device[] = await response.json();
            console.log(devices); // Log the prizes
            this.setState({ deviceList: devices });
        } catch (error) {
            console.error(error);
        }
    }
}
