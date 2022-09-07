import { Box, BoxProps, SxProps, Theme, Typography, TypographyProps } from "@mui/material";
import React, { useMemo } from "react";
import { useColors } from "../../hooks";
import { defaultBorderColor } from "../../interfaces";

interface LabeledTextProps {
  children?: React.ReactNode;
  condition?: boolean;
  containerProps?: BoxProps;
  label: string;
  labelProps?: TypographyProps;
  showWhenEmpty?: boolean;
  textProps?: TypographyProps;
}

const defaultLabelProps: TypographyProps = {
  color: "text.secondary",
  fontSize: "small",
  variant: "subtitle2",
};

const defaultTextProps: TypographyProps = {
  fontSize: "medium",
};

export const LabeledText: React.FC<LabeledTextProps> = ({
  condition,
  containerProps,
  labelProps,
  label,
  showWhenEmpty,
  textProps,
  children,
}) => {
  const { defaultBackgroundColor } = useColors();
  const defaultContainerProps: BoxProps = useMemo(() => {
    return {
      sx: {
        backgroundColor: defaultBackgroundColor,
        border: 1,
        borderColor: defaultBorderColor,
        float: "left",
        marginRight: 0.5,
        marginTop: 0.5,
        padding: 2,
        paddingBottom: 1,
        paddingTop: 1,
      },
    };
  }, [defaultBackgroundColor]);

  const sx: SxProps<Theme> | undefined = useMemo(() => {
    return containerProps?.sx
      ? ({ ...defaultContainerProps.sx, ...containerProps.sx } as SxProps<Theme>)
      : defaultContainerProps.sx;
  }, [containerProps?.sx, defaultContainerProps.sx]);

  return condition && (children || showWhenEmpty) ? (
    <Box {...defaultContainerProps} {...containerProps} sx={sx}>
      <Typography {...defaultLabelProps} {...labelProps}>
        {label}
      </Typography>
      <Typography {...defaultTextProps} {...textProps}>
        {children}
      </Typography>
    </Box>
  ) : (
    <></>
  );
};

LabeledText.defaultProps = {
  children: undefined,
  condition: true,
  containerProps: undefined,
  labelProps: defaultLabelProps,
  showWhenEmpty: false,
  textProps: defaultTextProps,
};
