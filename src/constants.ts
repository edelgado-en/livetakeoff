
export const API_PRODUCTION_BASE_URL = 'https://api-livetakeoff.herokuapp.com/';

export const API_DEV_BASE_URL = 'http://127.0.0.1:9000/';

export const DEV_SERVER_BASE_URL = 'http://localhost:3000/#/login';

export const PRODUCTION_SERVER_BASE_URL = 'TBD/#/login';


export const STANDARD_DROPDOWN_STYLES = { 
    control: (provided: any) => ({
        ...provided,
        padding: '0px',
        borderColor: '#cbd3da',
        '&:hover': {
            borderColor: '#a2a8ae'
        },
        minHeight: '',
        maxHeight: '35px'
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '12px'
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: '1px'
    }),
    singleValue: (provided: any) => ({
        ...provided,
        fontSize: '12px'
    }),
    option: (provided: any) => ({
        ...provided,
        fontSize: '12px',
        paddingBottom: '5px',
        paddingTop: '5px'
      }),
      groupHeading: (provided: any) => ({
        ...provided,
        background: '#f2f4f7',
        paddingTop: '5px',
        paddingBottom: '5px'
    })
}

export const STANDARD_MULTI_DROPDOWN_STYLES = {
    control: (provided: any) => ({
        ...provided,
        borderColor: '#cbd3da',
        '&:hover': {
            borderColor: '#a2a8ae'
        }
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      textOverflow: "ellipsis",
      maxWidth: "90%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      display: "initial"
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '12px'
    }),
    multiValueLabel: (styles: any) => ({
        ...styles,
        color: 'rgb(0, 184, 217)',
        backgroundColor: '#e5f7fb',
    }),
    multiValueRemove: (styles: any) => ({
        ...styles,
        color: 'rgb(0, 184, 217)',
        backgroundColor: '#e5f7fb',
        ':hover': {
          backgroundColor: '#7fdbec',
          color: 'white',
        },
    }),
    option: (provided: any) => ({
        ...provided,
        fontSize: '12px',
        paddingBottom: '5px',
        paddingTop: '5px'
      }),
      groupHeading: (provided: any) => ({
        ...provided,
        background: '#f2f4f7',
        paddingTop: '5px',
        paddingBottom: '5px'
    })
}

export const DATE_OPTIONS = [
    { value: 1, label: '7 days' },
    { value: 2, label: '14 days' },
    { value: 3, label: '30 days' },
    { value: 4, label: '60 days' },
    { value: 5, label: '90 days' }
]

export const PAGE_SIZE_OPTIONS = [
    { value: 50, label: 'Show 50' },
    { value: 100, label: 'Show 100' },
    { value: 150, label: 'Show 150' },
    { value: 200, label: 'Show 200' }
]

export const SOFTWARE_PACKAGE_STATUS_OPTIONS = [
    { value: 1, label: 'Passed' },
    { value: 2, label: 'Failed' },
    { value: 3, label: 'In Progress' },
    { value: 4, label: 'Blocked' },
    { value: 5, label: 'Planned' },
    { value: 6, label: 'NA' },
]
