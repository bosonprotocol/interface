import React, { useRef } from "react";
import Draggable from "react-draggable";
const coverImage =
  "https://bosonprotocol.infura-ipfs.io/ipfs/QmQSVFKCua3L9kxiXtpHYM6Vtzvvet5Y4EAyjnuUyCP1kG";
// export const HiddenTest = () => {
//   const parent = useRef<HTMLDivElement>(null);
//   const ref = useRef<HTMLImageElement>(null);
//   return (
//     <div style={{ border: "1px solid red", height: "500px" }} ref={ref}>
//       <div id="parent" ref={parent}>
//         {/* <Draggable offsetParent={ref.current ?? undefined}> */}
//         <img
//           src={coverImage}
//           data-cover-img
//           style={{
//             border: `1px solid grey`,
//             pointerEvents: "auto",
//             maxWidth: "100%"
//           }}
//         />
//         <Moveable
//           flushSync={flushSync}
//           draggable={true}
//           snappable={true}
//           target={parent.current}
//           //   dragTarget={parent.current}
//           dragContainer={parent.current}
//           //   container={ref.current}
//           //   rootContainer={ref.current}
//           // origin={true}
//           onDrag={({
//             target,
//             beforeDelta,
//             beforeDist,
//             left,
//             top,
//             right,
//             bottom,
//             delta,
//             dist,
//             transform,
//             clientX,
//             clientY
//           }) => {
//             // console.log("onDrag left, top", left, top);
//             // target!.style.left = `${left}px`;
//             // target!.style.top = `${top}px`;
//             // console.log("onDrag translate", dist, "transform", transform);
//             // target!.style.transform = transform;
//             // const translateX =
//             // console.log("onDrag", {
//             //   beforeDelta,
//             //   beforeDist,
//             //   left,
//             //   top,
//             //   right,
//             //   bottom,
//             //   delta,
//             //   dist,
//             //   transform,
//             //   clientX,
//             //   clientY
//             // });
//             console.log("onDrag", { left, right });
//             // if (right > 0 && left < 0) {
//             target!.style.transform = transform;
//             // }
//           }}
//           onDragEnd={({ target, isDrag, clientX, clientY }) => {
//             // console.log("onDragEnd", target, isDrag);
//           }}
//         ></Moveable>
//       </div>
//     </div>
//   );
// };

export const HiddenTest = () => {
  const parent = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLImageElement>(null);
  return (
    <div
      style={{ border: "1px solid red", height: "500px", position: "relative" }}
      ref={ref}
    >
      <Draggable bounds="parent">
        {/* <div
          style={{
            cursor: "grab",
            border: "1px solid blue",
            display: "block",
            width: "200px",
            height: "200px"
          }}
        >
          I can only be dragged vertically (y axis)
        </div> */}
        {/* <div
          data-cover-img
          style={{
            background: `url(${coverImage})`,
            border: `1px solid grey`,
            pointerEvents: "auto",
            width: "100%",
            height: "200px"
          }}
        /> */}
        <img
          src={coverImage}
          draggable={false}
          data-cover-img
          style={{
            border: `1px solid grey`,
            pointerEvents: "auto",
            maxWidth: "100%"
          }}
        />
      </Draggable>
    </div>
  );
};

export default HiddenTest;
