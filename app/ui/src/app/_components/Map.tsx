import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useId } from "react";
import { Icon } from "leaflet";

const icon: Icon = new Icon({ iconUrl: "/pin.svg" });

type Props = {
  position: [number, number];
  tooltip: string;
};

const Map = (props: Props) => {
  const id = useId();
  return (
    <MapContainer
      id={"Map_" + id}
      key={"Map_" + id}
      className="h-full w-full"
      center={props.position}
      zoom={13}
      scrollWheelZoom={false}
      touchZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={props.position} icon={icon}>
        <Popup>{props.tooltip}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
