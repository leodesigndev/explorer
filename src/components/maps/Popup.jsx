import React, { useContext, useEffect, useRef } from "react";
import { mapContext } from "./context/mapContext";
import mapboxgl from "mapbox-gl";

import Inputs from "../../configs/inputs";

export const Popup = ({ children, lngLat, onClose , popupClassesExtras }) => {
  const { map } = useContext(mapContext);
  const popupRef = useRef();

  useEffect(() => {
    // OEM const popup = new mapboxgl.Popup({})
    const popup = new mapboxgl.Popup({className : `ddl-map-popup ${popupClassesExtras}` })
      .setLngLat(lngLat)
      .setDOMContent(popupRef.current)
      .addTo(map)
      //.addClassName(popupClassesExtras) // snip


    popup.on("close", onClose);

    Inputs.mapboxPopupRef = popup ;

    return popup.remove;
  }, [children, lngLat]);

  return (
    <div style={{ display: "none" }}>
      <div ref={popupRef}>{children}</div>
    </div>
  );
};

export default Popup;