import styled from "styled-components";
import Theme from "../../styles/Theme";

export const ThemeSelectorWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  backdrop-filter: brightness(1.3);
  display: flex;
  flex-direction: column;
`;

export const ThemeListWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
`;

export const ThemeIconSet = styled.div`
  display: flex;
  border-radius: ${Theme.CONTAINER.BORDER_RADIUS};
  background-color: ${(p) =>
    p.themeBaseType === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"};
  padding: 12px 4px;
`;

export const ThemeColorIcon = styled.div`
  width: 16px;
  height: 16px;
  margin: 0 2px;
  border-radius: 100%;
  background-color: ${(p) => p.color};
`;

export const ChooseThemeHeader = styled.div`
  padding: 12px 0;
  color: ${Theme.COLORS.ON_BACKGROUND};
  font-weight: bold;
`;
