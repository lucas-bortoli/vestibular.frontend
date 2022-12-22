import { useEffect, useRef, useState } from "react";

const InformationFrame = () => {
  // Altura do iframe de informações
  const infoFrame = useRef();
  const [infoFrameHeight, setInfoFrameHeight] = useState(0);

  // Redimensionar iframe
  const resizeIframe = () => {
    setTimeout(() => {
      setInfoFrameHeight(infoFrame.current.contentWindow.document.body.scrollHeight);
    }, 200);
  };

  useEffect(() => {
    const onResize = () => {
      resizeIframe();
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  });

  return (
    <iframe
      src="/informacoesVestibular.html"
      title="informações vestibular"
      sandbox="allow-same-origin"
      onLoad={() => resizeIframe()}
      ref={infoFrame}
      style={{ minHeight: infoFrameHeight + "px" }}></iframe>
  );
};

export default InformationFrame;
