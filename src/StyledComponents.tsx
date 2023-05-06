import styled from 'styled-components';

// Styled button
const Button = styled.button`
    background-color: dodgerblue;
    outline-offset: 2px;
    padding: 0.5em 1em;
    color: white;
    border: none;
    border-radius: 16px;
    width: 10ch;
    cursor: pointer;
    `;

const Input = styled.input`
    background: rgba(0, 0, 0, 0.15);
    outline-offset: 6px;
    height: 0.35em;
    border: none;
    border-radius: 16px;
    max-width: 100px;

    &::-moz-range-thumb {
      background: dodgerblue;
      height: 1.25em;
      width: 1.25em;
      border-radius: 100%;
      cursor: pointer;
      border: none;
    }

    &::-webkit-slider-thumb {
      background: dodgerblue;
      height: 1.25em;
      width: 1.25em;
      border-radius: 100%;
      cursor: pointer;
    }

    &::-moz-range-progress {
      background-color: dodgerblue;
      height: 0.35em;
    }
    `;

export {Button, Input};