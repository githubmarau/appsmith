import React from "react";

import clsx from "classnames";

import { Icon } from "..";

import * as Styled from "./DismissibleTab.styles";
import { DATA_TEST_ID } from "./constants";

import type { DismissibleTabProps } from "./DismissibleTab.types";

export const DismissibleTab = ({
  children,
  dataTestId,
  isActive,
  onClick,
  onClose,
  onDoubleClick,
}: DismissibleTabProps) => {
  return (
    <Styled.Tab
      className={clsx("editor-tab", isActive && "active")}
      data-testid={dataTestId}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
      <Styled.CloseButton
        aria-label="Close tab"
        className="tab-close"
        data-testid={DATA_TEST_ID.CLOSE_BUTTON}
        isIconButton
        kind="tertiary"
        onClick={onClose}
        role="tab"
        size="sm"
        tabIndex={0}
      >
        <Icon name="close-line" />
      </Styled.CloseButton>
    </Styled.Tab>
  );
};
