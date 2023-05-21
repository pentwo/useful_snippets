// REACT IMPORTS

import { ActionIcon, createStyles, Group, Table, UnstyledButton, Text, Center, Skeleton } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconDirection, IconSelector } from "@tabler/icons-react";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { School } from "../../../interfaces/School";

// NEXT IMPORTS

// COMPONENT IMPORTS

// MANTINE IMPORTS
import { keys } from "@mantine/utils";
import { camelize } from "../../../helpers/helpers";
import ActiveBadge from "../badge/ActiveBadge";
import { LoadingContext } from "../../general/loading/context/context";
import { useMediaQuery } from "@mantine/hooks";
import Identity from "../../../networking/api/Auth/Identity";
// NETWORK IMPORTS

// TYPE IMPORTS

// FUNCTION IMPORTS

// STYLE IMPORTS

// interface Props {
//     headers: string[];
//     data: School[];
//     footer?: string[];
// }

interface Props {
    headers: string[];
    data: any[];
    actions?: React.ElementType[];
    footer?: string[];
    rowStyle?: string | undefined;
    headerStyle?: string | undefined;
}

interface DataType {
    [key: string]: string | number;
    name: string;
    address: string;
    state: string;
    subs: number;
}

const useStyles = createStyles((theme) => ({
    control: {
        color: theme.white,
    },
    icon: {},
    header: {
        "th:first-of-type": {
            borderRadius: `${theme.radius.md}px 0 0 0`,
        },
        "th:last-of-type": {
            borderRadius: `0 ${theme.radius.md}px 0 0`,
        },
        [theme.fn.smallerThan("md")]: {
            th: {
                padding: `${theme.spacing.xs}px !important`,
            },
        },
    },
    th: {
        backgroundColor: theme.colors.red[3],

        fontWeight: 500,
        position: "sticky",
        top: 0,
        zIndex: 1,
    },
    root: {},
}));

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
    disabled?: boolean;
}

const Th = ({ children, reversed, sorted, onSort, disabled }: ThProps) => {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control} disabled={disabled}>
                <Group position="apart">
                    <Text weight={500} size="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={14} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </th>
    );
};

function sortData(data: any[], payload: { sortBy: string; reversed: boolean }) {
    // If the object key is not camelized, then we need to camelized it for sorting
    data.forEach((d) => {
        Object.keys(d).forEach((key) => {
            const camelizedKey = camelize(key);
            if (camelizedKey !== key) {
                d[camelizedKey] = d[key];
                delete d[key];
            }
        });
        return d;
    });

    const { sortBy } = payload;

    return [...data].sort((a, b) => {
        if (typeof a[sortBy] === "boolean") {
            if (payload.reversed) {
                return b[sortBy] - a[sortBy];
            }

            return a[sortBy] - b[sortBy];
        }

        if (typeof a[sortBy] === "number") {
            if (payload.reversed) {
                return b[sortBy] - a[sortBy];
            }

            return a[sortBy] - b[sortBy];
        }

        if (payload.reversed) {
            return b[sortBy].localeCompare(a[sortBy]);
        }

        return a[sortBy].localeCompare(b[sortBy]);
    });
}

const TableContent = ({ headers, data, actions, footer, rowStyle, headerStyle }: Props) => {
    const { loading, setLoading } = useContext(LoadingContext);
    const { classes } = useStyles();

    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<any>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const mediumScreen = useMediaQuery("(max-width: 992px)");

    const setSorting = (field: string) => {
        const camelizedField = camelize(field);

        const reversed = camelizedField === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(camelize(camelizedField));
        setSortedData(sortData(data, { sortBy: camelizedField, reversed }));
    };

    // TABLE HEADERS
    const ths = headers.map((header, i) => {
        return (
            <Th
                key={header}
                reversed={reverseSortDirection}
                sorted={sortBy === camelize(header)}
                onSort={() => {
                    setSorting(header);
                }}
                disabled={header === "Actions"}
            >
                {header}
            </Th>
        );
    });

    const compactThs = useMemo(() => {
        // only show the fist tdNum - 1 and the last td
        return ths.slice(0, 2).concat(ths.slice(-1));
    }, [ths]);

    // Action Cell
    const actionsCell = (actions: React.ElementType[] | undefined, id: number, invited: boolean) => {
        if (actions && actions?.length > 0) {
            return (
                <td key={`actions`}>
                    {actions.map((Action, i) => {
                        return <Action key={`action-${i}`} id={id} invited={invited} />;
                    })}
                </td>
            );
        } else {
            return null;
        }
    };

    // ROWS
    const rows = useMemo(() => {
        return sortedData.map((row) => {
            const identify: number = row.id || row.studentId;
            const invited: boolean = row.invitedOn ? true : false;

            let tds = Object.keys(row).map((cell, i) => {
                if (typeof row[cell] === "boolean") {
                    return (
                        <td key={`${cell}-${i}`}>
                            <ActiveBadge active={row[cell]} />
                        </td>
                    );
                } else if (cell === "id" || cell === "invitedOn") {
                    return null;
                } else {
                    return <td key={`${cell}-${i}`}>{row[cell]}</td>;
                }
            });
            tds = tds.concat(actionsCell(actions, identify, invited));

            return <tr key={JSON.stringify(row)}>{tds}</tr>;
        });
    }, [sortedData, data]);

    // COMPACT ROWS (For mobile)
    const compactRows = useMemo(() => {
        return sortedData.map((row) => {
            const identify: number = row.id || row.studentId;
            const invited: boolean = row.invitedOn ? true : false;

            let tds = Object.keys(row).map((cell, i) => {
                if (i > 2) return null;
                if (typeof row[cell] === "boolean") {
                    return (
                        <td key={`${cell}-${i}`}>
                            <ActiveBadge active={row[cell]} />
                        </td>
                    );
                } else if (cell === "id" || cell === "invitedOn") {
                    return null;
                } else {
                    return <td key={`${cell}-${i}`}>{row[cell]}</td>;
                }
            });
            tds = tds.concat(actionsCell(actions, identify, invited));

            return <tr key={JSON.stringify(row)}>{tds}</tr>;
        });
    }, [rows]);

    useEffect(() => {
        setSortedData(data);

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [data]);

    return (
        <>
            {/* {mediumScreen ? null : ( */}
            <Table striped highlightOnHover verticalSpacing={"md"} horizontalSpacing={"md"} className={classes.root}>
                <thead className={headerStyle ? headerStyle : classes.header}>
                    <tr>{mediumScreen ? compactThs : ths}</tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 5 }, (v, i) => i).map((row, i) => {
                            return (
                                <tr key={`skeleton-row-${i}`}>
                                    {/* Loading skeleton component */}
                                    {Array.from({ length: mediumScreen ? 3 : headers.length }, (v, i) => i).map(
                                        (elem, j) => {
                                            return (
                                                <td key={`skeleton-row-${i}-td-${j}`}>
                                                    <Skeleton visible={loading} height={50} />
                                                </td>
                                            );
                                        }
                                    )}
                                </tr>
                            );
                        })
                    ) : rows.length > 0 ? (
                        mediumScreen ? (
                            compactRows
                        ) : (
                            rows
                        )
                    ) : (
                        <tr>
                            <td colSpan={headers.length}>
                                <Text weight={500} align="center">
                                    Nothing found
                                </Text>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {/* )} */}
        </>
    );
};

export default TableContent;
