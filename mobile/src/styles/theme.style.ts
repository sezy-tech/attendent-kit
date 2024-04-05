const theme = {
    primary: {
      backgroundColor: '#F987C5',
      color: '#484848',
      fontSize: 15,
      borderRadius: 4,
    },
    secondary: {
      backgroundColor: '#F987C5',
      color: '#484848',
      fontSize: 15,
      borderRadius: 4,
    },
    header: {
      height: 30,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    btn: {
      wrapper: {
        pv: 12,
        ph: 16,
        height: 50,
        color: 'white',
        fontSize: 15,
        borderRadius: 4,
        underlayColor: '#cdcdcd',
      },
      disabled: {
        backgroundColor: '#bbb',
      },
    },
    collapse: {
      title: {
        backgroundColor: '#eee',
      },
      item: {
        backgroundColor: '#fff',
        // lineColor: '#ddd',
      },
      // activeItem: {
      //     backgroundColor: '#9bcaff',
      // },
      chevron: {
        size: 20,
      },
      icon: {
        size: 20,
      },
    },
    footer: {
      height: 60,
      // paddingHorizontal: 16,
      // paddingLeft: 8,
      // paddingVertical: 12,
      backgroundColor: '#ddd',
      item: {
        borderRadius: 12,
        // borderWidth: 2,
        // borderColor: '#888',
        // backgroundColor: '#fff',
        minWidth: 60,
        height: 40,
        // paddingHorizontal: 4,
        // padding: 16,
      },
      itemText: {
        flexWrap: 'wrap',
        fontSize: 12,
      },
    },
    input: {
      wrapper: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        // paddingVertical: 8,
        paddingHorizontal: 8,
      },
      container: {},
      input: {
        height: 40,
      },
    },
    popup: {
      container: {
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
      closeSide: {
        backgroundColor: '#000000aa',
      },
    },
    drawer: {
      closeSide: {
        backgroundColor: '#000000aa',
      },
    },
    select: {
      modal: {
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
      // input: {
      //     borderRadius: 8,
      //     borderWidth: 1,
      //     borderColor: '#888',
      // },
      closeSide: {
        backgroundColor: '#00000033',
      },
    },
    table: {
      wrapper: {
        minWidth: '100%',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      thead: {
        backgroundColor: '#ddd',
        with: '100%',
        // position: 'sticky',
        // top: 100,
        // zIndex: 1,
      },
      tbody: {},
      tr: {
        flexDirection: 'row',
      },
      th: {
        padding: 8,
        // fontWeight: '500',
        // paddingVertical: 8,
      },
      td: {
        padding: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
      },
    },
    colors: {
      success: '#43a047',
      warning: '#ffb300',
      danger: '#e53935',
      info: '#00acc1',
    },
    list: {
      item: {
        gap: 8,
      },
    },
    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      250: '#fbb5e0',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
    },
    sky: {
      400: '#38bdf8',
    },
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
    },
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
    },
  } as const;
  
  export default theme;
  