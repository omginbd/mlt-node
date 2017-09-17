export default class Matrix {
    private m_data;
    private m_attr_name;
    private m_str_to_enum;
    private m_enum_to_str;
    constructor(that?: Matrix, rowStart?: number, colStart?: number, rowCount?: number, colCount?: number);
    /**
     * Adds a copy of the specified portion of that matrix to this matrix
     */
    add(that: Matrix, rowStart: number, colStart: number, rowCount: number): void;
    /**
     * Resizes this matrix (and sets all attributes to be continuous)
     * @param rows
     * @param cols
     */
    setSize(rows: number, cols: number): void;
    /**
     * Loads from an ARFF file
     */
    loadArff(filename: string): void;
    /** Returns the number of rows in the matrix */
    rows(): number;
    /** Returns the number of columns (or attributes) in the matrix */
    cols(): number;
    /** Returns the specified row */
    row(r: number): number[];
    /** Returns the element at the specified row and column */
    get(r: number, c: number): number;
    /** Sets the value at the specified row and column */
    set(r: number, c: number, v: number): void;
    /** Returns the name of the specified attribute */
    attrName(col: number): string;
    /** Set the name of the specified attribute */
    setAttrName(col: number, name: string): void;
    /** Returns the name of the specified value */
    attrValue(attr: number, val: number): string;
    /**
     * Returns the number of values associated with the specified attribute (or column)
     * 0=continuous, 2=binary, 3=trinary, etc.
    */
    valueCount(col: number): number;
    /**
     * Shuffles the row order with a buddy matrix.
     * Differs from java toolkit because it doesn't accept the java `Random`
     * construct as the first parameter.
     */
    shuffle(buddy?: Matrix): void;
    /** Returns the mean of the specified column */
    columnMean(col: number): number;
    /** Returns the min value in the specified column */
    columnMin(col: number): number;
    /** Returns the max value in the specified column */
    columnMax(col: number): any;
    /** Returns the most common value in the specified column */
    mostCommonValue(col: number): any;
    normalize(): void;
    print(): void;
}
