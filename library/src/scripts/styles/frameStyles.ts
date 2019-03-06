/*
 * @author Stéphane LaFlèche <stephane.l@vanillaforums.com>
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import { globalVariables } from "@library/styles/globalStyleVars";
import { styleFactory, useThemeCache, variableFactory } from "@library/styles/styleUtils";
import { font, paddings, singleBorder, toStringColor, unit } from "@library/styles/styleHelpers";
import { calc, percent, viewHeight } from "csx";
import { formElementsVariables } from "@library/components/forms/formElementStyles";

export const frameVariables = useThemeCache(() => {
    const globalVars = globalVariables();
    const makeThemeVars = variableFactory("frame");

    const colors = makeThemeVars("colors", {
        bg: globalVars.mainColors.bg,
    });

    const sizing = makeThemeVars("sizing", {
        large: 720,
        medium: 516,
        small: 375,
    });

    const border = makeThemeVars("border", {
        radius: globalVars.border.radius,
    });

    const spacing = makeThemeVars("spacing", {
        padding: 36,
    });

    const header = makeThemeVars("header", {
        minHeight: 44,
        spacing: 12,
        fontSize: globalVars.fonts.size.subTitle,
    });

    const footer = makeThemeVars("footer", {
        spacing: header.spacing,
        minHeight: header.minHeight,
    });

    const panel = makeThemeVars("panel", {
        minHeight: 500,
    });

    return { colors, sizing, border, spacing, header, footer, panel };
});

export const frameClasses = useThemeCache(() => {
    const vars = frameVariables();
    const style = styleFactory("frame");
    const root = style({
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: toStringColor(vars.colors.bg),
        maxHeight: viewHeight(100),
        borderRadius: unit(vars.border.radius),
    });
    return { root };
});

export const frameHeaderClasses = useThemeCache(() => {
    const vars = frameVariables();
    const globalVars = globalVariables();
    const formElVars = formElementsVariables();
    const style = styleFactory("frameHeader");

    const root = style({
        display: "flex",
        position: "relative",
        alignItems: "center",
        flexWrap: "nowrap",
        width: percent(100),
        minHeight: unit(vars.header.minHeight),
        zIndex: 1,
        ...paddings({
            top: 0,
            right: vars.footer.spacing,
            bottom: 0,
            left: vars.footer.spacing,
        }),
        borderTop: singleBorder({
            color: globalVars.overlay.border.color,
        }),
        $nest: {
            "& .button + .button": {
                marginLeft: unit(12 - formElVars.border.width),
            },
        },
    });

    const backButton = style("backButton", {
        $nest: {
            ".&.buttonIcon": {
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "center",
                alignItems: "flex-end",
                flexShrink: 1,
                minWidth: unit(globalVars.icon.sizes.large),
                width: unit(globalVars.icon.sizes.large),
                marginLeft: unit(-8),
            },
        },
    });

    const heading = style("heading", {
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
        textOverflow: "ellipsis",
        ...font({
            weight: globalVars.fonts.weights.semiBold,
            size: globalVars.fonts.size.large,
        }),
    });

    const left = style("left", {
        fontSize: unit(vars.header.fontSize),
    });

    const centred = style("centred", {
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: unit(globalVars.fonts.size.small),
        color: toStringColor(globalVars.mixBgAndFg(0.6)),
    });

    const leftSpacer = style("leftSpacer", {
        display: "block",
        height: unit(formElVars.sizing.height),
        flexBasis: unit(formElVars.sizing.height),
        width: unit(formElVars.sizing.height),
    });

    const action = style("action", {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 1,
        height: unit(formElVars.sizing.height),
        transform: `translateX(6px)`,
    });

    const closePosition = style("closePosition", {
        marginLeft: "auto",
    });

    return { root, backButton, heading, left, centred, leftSpacer, action, closePosition };
});

export const frameBodyClasses = useThemeCache(() => {
    const vars = frameVariables();
    const style = styleFactory("frameFooter");

    const root = style({
        position: "relative",
        flexGrow: 1,
        maxHeight: percent(100),
        overflow: "auto",
        ...paddings({
            left: 12,
            right: 12,
        }),
        $nest: {
            "&.isSelfPadded": {
                ...paddings({
                    left: 0,
                    right: 0,
                }),
            },
            "&.inheritHeight": {
                $nest: {
                    ".framePanel": {
                        maxHeight: percent(100),
                    },
                },
            },
        },
    });

    const noContentMessage = style("noContentMessage", {
        ...paddings({
            top: vars.header.spacing * 2,
            right: vars.header.spacing,
            bottom: vars.header.spacing * 2,
            left: vars.header.spacing,
        }),
    });
    const contents = style("contents", {
        ...paddings({
            top: vars.header.spacing / 2,
            right: 0,
            bottom: vars.header.spacing / 2,
            left: 0,
        }),
        minHeight: unit(50),
    });
    return { root, noContentMessage, contents };
});

export const framePanelClasses = useThemeCache(() => {
    const vars = frameVariables();
    const globalVars = globalVariables();
    const style = styleFactory("frameFooter");

    const root = style({
        position: "relative",
        flexGrow: 1,
        height: percent(100),
        backgroundColor: toStringColor(vars.colors.bg),
        overflow: "auto",
        maxHeight: calc(`100vh - ${vars.header.minHeight + vars.footer.minHeight + vars.spacing.padding * 2}`),

        $nest: {
            "& > .inputBlock": {
                $nest: {
                    "&.isFirst": {
                        marginTop: unit(globalVars.gutter.half),
                    },
                    "&.isLast": {
                        marginBottom: unit(globalVars.gutter.half),
                    },
                },
            },
        },
    });
    return { root };
});

export const frameFooterClasses = useThemeCache(() => {
    const globalVars = globalVariables();
    const style = styleFactory("frameFooter");

    const root = style({});

    const markRead = style("markRead", {
        $nest: {
            "&.buttonAsText": {
                fontWeight: globalVars.fonts.weights.semiBold,
                color: toStringColor(globalVars.mainColors.primary),
            },
        },
    });
    return { root, markRead };
});
