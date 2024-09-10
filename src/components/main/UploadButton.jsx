import styled from "styled-components";
import upload from "/assets/Icon/UploadButton.svg";

const UploadButton = () => {
    return (
        <>
            <UploadIcon />
        </>
    );
}

export default UploadButton;

const UploadIcon = styled.img.attrs({
    src: upload,
    alt: "Upload Button"
})`
    position: fixed;
    
    width: 55px;
    height: 55px;
`