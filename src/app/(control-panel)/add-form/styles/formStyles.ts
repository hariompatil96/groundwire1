import styled from "styled-components";

export const FormDragDropContainer = styled.div`
    display:flex;
    justify-content: space-between;
    align-items: center;
    gap:1rem;
`;

export const EditForm = {
    color: "black",
    border: "1px solid gray",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    gap: "0.5rem",
    position: "relative",
    width: "100%",
    height: "100%",
};

export const DropContainer = {
    border: "2px dashed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    color: "#8080807a",
    borderRadius: "12px",
    position: "relative",
    width: "100%",
    height: "100%",
}

export const DropText = {
    position: "absolute",
    width: "100%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    color: "gray",
    fontSize: "2rem",
    textAlign: "center"
}

export const ToolBoxStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    borderRadius: "12px",
    backgroundColor: "white",
    position: "sticky",
    top: "6rem",
}

export const ToolBoxItem = styled.p`
    padding: 12px;
    font-size: 1.2rem;
    width: 100%;
    text-transform: capitalize;
`

export const StyledInput = styled.input`
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid gray;

    &:focus {
    box-shadow: 0px 0px 8px rgba(128, 128, 128, 0.56);
    outline: none;
  }
`

export const InputContainer = styled.div`
    display:flex;
    flex-direction: column;
    gap:0.2rem;
    background-color: white;
    border-radius: 6px;
    padding: 0.5rem;
    position: relative;

    button{
    width: fit-content;
    }
`

export const FormElementContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    height: "100%",
}


export const StyledTextarea = styled.textarea`
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid gray;

    &:focus {
    box-shadow: 0px 0px 8px rgba(128, 128, 128, 0.56);
    outline: none;
  }`


export const EditInputElement = styled.div`
    position: absolute;  
    top: 0;
    right: 0;
    padding: 0px 4px 2px 4px;
    border: 1px solid rgba(128, 128, 128, 0.56);
    border-top: 0;
    border-radius: 0 0 8px 8px;
    display: flex;
    gap: 0.5rem;
`

export const StyledSelect = styled.select`
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid gray;
`