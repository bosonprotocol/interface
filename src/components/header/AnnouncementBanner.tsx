import { styled } from "styled-components";

const Wrapper = styled.a`
  font-size: 0.875rem;
  background-color: rgb(120 41 249);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke,
    opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.2s;
  padding: 0.5rem;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  * {
    font-size: inherit;
  }
  svg {
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.2s;
    left: 0;
  }
  &:hover {
    background-color: rgb(9 24 44);
    svg {
      left: 10px;
      position: relative;
    }
  }
`;

export const AnnouncementBanner = () => {
  return (
    <Wrapper href="https://form.typeform.com/to/nHbO8y3e" target="_blank">
      <span>Help us improve: take the Boson website survey (3 mins)</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="24"
          height="24"
          transform="translate(0.5)"
          fill="#02F3A2"
        ></rect>
        <path
          d="M11.95 6.25C12.1 6.11667 12.2417 6.11667 12.375 6.25L17.6 11.5C17.75 11.6333 17.75 11.7667 17.6 11.9L12.375 17.15C12.2417 17.2833 12.1 17.2833 11.95 17.15L11.45 16.65C11.4 16.6 11.375 16.5333 11.375 16.45C11.375 16.3667 11.4 16.2917 11.45 16.225L15.325 12.35H6.8C6.6 12.35 6.5 12.25 6.5 12.05V11.35C6.5 11.15 6.6 11.05 6.8 11.05H15.325L11.45 7.175C11.3167 7.025 11.3167 6.88333 11.45 6.75L11.95 6.25Z"
          fill="#09182C"
        ></path>
      </svg>
    </Wrapper>
  );
};
