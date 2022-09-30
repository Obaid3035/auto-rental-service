import React, {useEffect, useState} from 'react';
import MUIDataTable, {FilterType} from "mui-datatables";
import OverLaySpinner from "../../lib/Spinner/Spinner";
import DisplayError from "../DisplayError/DisplayError";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import download from "downloadjs";
import axios from "axios";
const _ = require('lodash');

export const getMuiTheme = () => createTheme({
    overrides: {
        MUIDataTable: {
            paper: {
                boxShadow: "0px 2px 8px 3px rgb(0 0 0 / 10%)"
            }
        },

        MuiIconButton:{
            root: {
                color: "red"
            }
        },

        MuiPaper: {
            rounded: {
                borderRadius: "10px"

            }
        },

        MUIDataTableBodyCell: {
            root: {
                backgroundColor: "#fff",
                fontFamily: 'Montserrat',
                fontSize: '12px',
                paddingLeft: '11px'
            }
        },
        MuiTablePagination: {
            caption: {
                fontFamily: 'Montserrat',
            }
        },
        MuiSelect: {
            select: {
                fontFamily: 'Montserrat',
            }
        },
        MuiTypography: {
            h6: {
                fontFamily: 'Montserrat',
            }
        },
        MUIDataTableHeadCell: {
            data: {
                fontSize: '12px',
                fontFamily: 'Montserrat',
            },
            fixedHeader: {
                backgroundColor: '#F4E9EA'
            }
        },
        MUIDataTableSearch: {
            searchIcon: {
                color: '#DB1B1B'
            }
        },
        MUIDataTableJumpToPage: {
            select: {
              paddingTop: '21px'
            },
            caption: {
                fontFamily: 'Montserrat',
            }
        },
        MuiTableCell: {
            root: {
                padding: '16px 8px'
            }
        },
    },
})

const MuiDataTable = (props: { tableName: string, columns: any, api: any, isLoading?: boolean, search: boolean, params?: string, csv: string, download: boolean}) => {
    const [skip, setSkip] = useState(true);
    const [state, setState] = useState({
        page: 0,
        rowsPerPage:10,
        searchText: '',
    });

    const {data = { table: [], count: 0}, isFetching, isLoading,error, isError} = props.api({page: state.page, size: state.rowsPerPage, search: state.searchText, params: props.params}, {
        skip
    });

    useEffect(() => {
        setSkip(false);
    }, [props.isLoading])

    const handler = _.debounce((newTableState: any) => {
        setState({
            ...state,
            searchText: newTableState.searchText,
            page: newTableState.page,
        })
    }, 1000)

    const search = (newTableState: any) => {
        if (!newTableState.searchText) {
            newTableState.searchText = ''
        }
        if (newTableState.searchText.length >= 0) {
            handler(newTableState)
        }
    }

    const changePage = (newTableState: any) => {
        setState({
            ...state,
            page: newTableState.page,
        });
    }

    const options: FilterType | any  = {
        filter: false,
        search: props.search,
        count: data.count,
        rowsPerPage: state.rowsPerPage,
        rowsPerPageOptions: [],
        searchText: state.searchText,
        serverSide: true,
        jumpToPage: false,
        download: props.download,
        print: false,
        viewColumns: false,
        responsive: 'standard',
        page: state.page,
        filterType: "checkbox",
        selectableRows: 'none',
        onDownload: () => {
            axios.get(`${props.csv}-csv`)
                .then((res) => {
                    let csv = props.columns.filter((col: any) => {
                        return !col.name;
                    }).toString().concat("\n")
                    const body = res.data;
                    body.forEach(function(row: any) {
                        csv += row.join(',');
                        csv += "\n";
                    });
                    download(csv, `${props.csv}.csv`, "text/csv")
                })
            return false;
        },
        onTableChange: (action: string, newTableState: any) => {
            switch (action) {
                case 'changePage':
                    changePage(newTableState);
                    break;
                case 'search':
                    search(newTableState);
                    break;
            }
        },
        textLabels: {
            body: {
                noMatch: isFetching ?
                    (
                        <OverLaySpinner isActive={isFetching} />
                    )
                    :
                    'No Data Found'
            }
        },
    };

    if (isLoading) {
        return <OverLaySpinner isActive={isLoading} />
    }


    if (isError) {
        return <DisplayError error={error}/>
    }

    if (isFetching) {
        return <OverLaySpinner isActive={isFetching} />
    }

    if (props.isLoading) {
        return <OverLaySpinner isActive={props.isLoading} />
    }

    return (
        <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
                title={`${props.tableName} List`}
                data={data.table}
                columns={props.columns}
                options={options}
            />
        </ThemeProvider>
    );
};

export default MuiDataTable;
