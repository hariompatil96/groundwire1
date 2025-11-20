import styled from "styled-components"

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 2rem;
    margin: auto;
    width: 80%;

    @media (max-width:550px){
    width: 90%;
    padding:1rem;
    }
`

export const SubmitButton = {
    fontSize: "1.2rem",
    backgroundColor: "#018594",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    width: "fit-content",
    margin: "auto",}

