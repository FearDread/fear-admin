/**
 * Lets every column's `Cell` read `{ original, value }` no matter which react-table version
 * your ReactTable wrapper uses:
 *   v6   passes `original` (and `row._original`)
 *   v7+  passes `row.original` (and `getValue()` in v8)
 *
 * Wrap a columns array with it:  const columns = useMemo(() => normalizeCells([ ... ]), [deps]);
 */
const normalizeCells = (columns) =>
    columns.map((column) => {
        if (!column.Cell) return column;
        const Cell = (props) => {
            const original = props.original ?? props.row?.original ?? props.row?._original;
            if (original === undefined) {
                // Fail loudly in the console instead of crashing the page
                console.error("ReactTable passed Cell no row data. Props received:", props);
                return null;
            }
            return column.Cell({ ...props, original, value: props.value ?? props.getValue?.() });
        };
        return { ...column, Cell };
    });

export default normalizeCells;