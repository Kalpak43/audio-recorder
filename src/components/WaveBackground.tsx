import React from "react";

function WaveBackground() {
  return (
    <div className="ondebox fixed  inset-x-0 bottom-0">
      <svg
        className="onde"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="onda"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352Z"
          />
        </defs>
        <g className="parallaxonde">
          <use xlinkHref="#onda" x="48" y="0" fill="rgba(17, 170, 160, 0.38)" />
          <use xlinkHref="#onda" x="48" y="3" fill="rgba(17, 170, 160, 0.17)" />
          <use xlinkHref="#onda" x="48" y="5" fill="rgba(17,170,159,0.1)" />
          <use xlinkHref="#onda" x="48" y="7" fill="rgb(144, 144, 144)" />
        </g>
      </svg>
    </div>
  );
}

export default WaveBackground;
