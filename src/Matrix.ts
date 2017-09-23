import * as fs from 'fs'
import * as readline from 'readline'

export default class Matrix {
  // Data
  private m_data: number[][]

  // Meta-data
  private m_relation_name: string
  private m_attr_name: string[]
  private m_str_to_enum: Map<string, number>[]
  private m_enum_to_str: Map<number, string>[]

  // Copies the specified portion of that matrix into this matrix
  constructor(
    that?: Matrix,
    rowStart?: number,
    colStart?: number,
    rowCount?: number,
    colCount?: number,
    relationName?: string
  ) {
    this.m_data = []
    this.m_attr_name = []
    this.m_str_to_enum = []
    this.m_enum_to_str = []
    this.m_relation_name = relationName
    if (that !== undefined) {
      for (let j = 0; j < rowCount; j++) {
        const rowSrc = that.row(rowStart + j) as number[]
        const rowDest: number[] = []
        for (let i = 0; i < colCount; i++) {
          rowDest[i] = rowSrc[colStart + i]
        }
        this.m_data.push(rowDest)
      }
      for (let i = 0; i < colCount; i++) {
        this.m_attr_name.push(that.attrName(colStart + i))
        this.m_str_to_enum.push(that.m_str_to_enum[colStart + i])
        this.m_enum_to_str.push(that.m_enum_to_str[colStart + i])
      }
    }
  }

  /**
   * Returns the relation name
   */
  relationName() {
    return this.m_relation_name
  }

  /**
   * Adds a copy of the specified portion of that matrix to this matrix
   */
  add(that: Matrix, rowStart: number, colStart: number, rowCount: number) {
    if (colStart + this.cols() > that.cols()) {
      throw new Error('out of range')
    }
    for (let i = 0; i < this.cols(); i++) {
      if (that.valueCount(colStart + i) !== this.valueCount(i)) {
        throw new Error('incompatible relations')
      }
    }
    for (let j = 0; j < rowCount; j++) {
      const rowSrc: number[] = that.row(rowStart + j)
      const rowDest: number[] = []
      for (let i = 0; i < this.cols(); i++) {
        rowDest[i] = rowSrc[colStart + i]
      }
      this.m_data.push(rowDest)
    }
  }

  /**
   * Resizes this matrix (and sets all attributes to be continuous)
   * @param rows
   * @param cols
   */
  setSize(rows: number, cols: number) {
    this.m_data = []
    for (let j = 0; j < rows; j++) {
      const row: number[] = []
      this.m_data.push(row)
    }
    this.m_attr_name = []
    this.m_str_to_enum = []
    this.m_enum_to_str = []
    for (let i = 0; i < cols; i++) {
      this.m_attr_name.push('')
      this.m_str_to_enum.push(new Map<string, number>())
      this.m_enum_to_str.push(new Map<number, string>())
    }
  }

  /**
   * Loads from an ARFF file
   */
  public loadArff(filename: string) {
    this.m_data = []
    this.m_attr_name = []
    this.m_str_to_enum = []
    this.m_enum_to_str = []
    let READDATA = false // Set to true once you read a line with '@DATA'
    fs
      .readFileSync(filename, 'utf-8')
      .split('\n')
      .forEach((line: string) => {
        line = line.trim()
        if (line.length > 0 && !line.startsWith('%')) {
          if (!READDATA) {
            const firstToken = line.split(' ')[0].toUpperCase()
            switch (firstToken) {
              case '@RELATION':
                this.m_relation_name = line.split(' ')[1].toUpperCase()
                break
              case '@ATTRIBUTE':
                let ste = new Map<string, number>()
                let ets = new Map<number, string>()
                const lineFields = line.split(/\s+/)
                this.m_attr_name.push(lineFields[1])
                const type = lineFields[2].trim().toUpperCase()
                if (
                  type !== 'REAL' &&
                  type !== 'CONTINUOUS' &&
                  type !== 'INTEGER'
                ) {
                  try {
                    const values = line
                      .substring(line.indexOf('{') + 1, line.indexOf('}'))
                      .split(',')
                      .map(v => v.trim())
                    values.forEach((value, i) => {
                      if (value.length > 0) {
                        ste.set(value, i)
                        ets.set(i, value)
                      }
                    })
                  } catch (e) {
                    throw new Error(
                      'Error parsing line: ' + line + '\n' + e.message
                    )
                  }
                }
                this.m_str_to_enum.push(ste)
                this.m_enum_to_str.push(ets)
                break
              case '@DATA':
                READDATA = true
                break
              default:
                throw new Error(
                  "Error processing file. Expected @RELATION, @ATTRIBUTE, or @DATA. Instead got '" +
                    line +
                    "'."
                )
            }
          } else {
            try {
              const attributes = line.split(',')
              const dataRow = attributes.map((attribute, i) => {
                attribute = attribute.trim()
                if (attribute.length > 0) {
                  //Missing instances appear in the dataset as undefined
                  if (attribute === '?') {
                    return undefined
                  } else if (this.m_enum_to_str[i].size === 0) {
                    // Continuous values appear in the instance vector as they are
                    return parseFloat(attribute)
                  } else {
                    // Discrete values appear as an index to the "name"
                    // of that value in the "attributeValue" structure
                    const result = this.m_str_to_enum[i].get(attribute)
                    if (result === undefined) {
                      throw new Error(
                        `Error parsing the value '${attribute}' on line: ${line}`
                      )
                    }
                    return result
                  }
                } else {
                  throw new Error(
                    `Error: attribute '${i + 1}' is missing on line: ${line}`
                  )
                }
              })
              this.m_data.push(dataRow)
            } catch (e) {
              throw new Error('Error parsing line: ' + line + '\n' + e.message)
            }
          }
        }
      })
  }

  /** Returns the number of rows in the matrix */
  rows() {
    return this.m_data.length
  }

  /** Returns the number of columns (or attributes) in the matrix */
  cols() {
    return this.m_attr_name.length
  }

  /** Returns the specified row */
  row(r: number) {
    return this.m_data[r]
  }

  /** Returns the element at the specified row and column */
  get(r: number, c: number) {
    return this.m_data[r][c]
  }

  /** Sets the value at the specified row and column */
  set(r: number, c: number, v: number) {
    this.row(r)[c] = v
  }

  /** Returns the name of the specified attribute */
  attrName(col: number) {
    return this.m_attr_name[col]
  }

  /** Set the name of the specified attribute */
  setAttrName(col: number, name: string) {
    this.m_attr_name[col] = name
  }

  /** Returns the name of the specified value */
  attrValue(attr: number, val: number) {
    return this.m_enum_to_str[attr].get(val) as string
  }

  /**
   * Returns the number of values associated with the specified attribute (or column)
   * 0=continuous, 2=binary, 3=trinary, etc.
  */
  valueCount(col: number) {
    return this.m_enum_to_str[col].size
  }

  /**
   * Shuffles the row order with a buddy matrix.
   * Differs from java toolkit because it doesn't accept the java `Random`
   * construct as the first parameter.
   */
  shuffle(buddy?: Matrix) {
    for (let n = this.rows(); n > 0; n--) {
      const i = Math.floor(Math.random() * n)
      const tmp = this.row(n - 1)
      this.m_data[n - 1] = this.row(i)
      this.m_data[i] = tmp
      if (buddy) {
        const tmp1 = buddy.row(n - 1)
        buddy.m_data[n - 1] = buddy.row(i)
        buddy.m_data[i] = tmp1
      }
    }
  }

  /** Returns the mean of the specified column */
  columnMean(col: number) {
    let sum = 0
    let count = 0
    for (let i = 0; i < this.rows(); i++) {
      const v = this.get(i, col)
      if (v !== undefined) {
        sum += v
        count++
      }
    }
    return sum / count
  }

  /** Returns the min value in the specified column */
  columnMin(col: number): number {
    let m = undefined
    for (let i = 0; i < this.rows(); i++) {
      const v = this.get(i, col)
      if (v !== undefined) {
        if (m === undefined || v < m) m = v
      }
    }
    return m
  }

  /** Returns the max value in the specified column */
  columnMax(col: number) {
    let m = undefined
    for (let i = 0; i < this.rows(); i++) {
      const v = this.get(i, col)
      if (v !== undefined) {
        if (m === undefined || v > m) m = v
      }
    }
    return m
  }

  /** Returns the most common value in the specified column */
  mostCommonValue(col: number) {
    const tm = new Map<number, number>()
    for (let i = 0; i < this.rows(); i++) {
      const v = this.get(i, col)
      if (v !== undefined) {
        const count = tm.get(v)
        if (count === undefined) {
          tm.set(v, 1)
        } else {
          tm.set(v, count + 1)
        }
      }
    }
    let maxCount = 0
    let val = undefined
    tm.forEach((value: number, key: number) => {
      if (value > maxCount) {
        maxCount = value
        val = key
      }
    })
    return val
  }

  normalize() {
    for (let i = 0; i < this.cols(); i++) {
      if (this.valueCount(i) === 0) {
        const min = this.columnMin(i)
        const max = this.columnMax(i)
        for (let j = 0; j < this.rows(); j++) {
          const v = this.get(j, i)
          if (v !== undefined) {
            this.set(j, i, (v - min) / (max - min))
          }
        }
      }
    }
  }

  print() {
    console.log(`@RELATION ${this.m_relation_name}\n`)
    for (let i = 0; i < this.m_attr_name.length; i++) {
      console.log('@ATTRIBUTE ' + this.m_attr_name[i])
      const vals = this.valueCount(i)
      if (vals === 0) {
        console.log(' CONTINUOUS\n')
      } else {
        console.log(' {')
        for (let j = 0; j < vals; j++) {
          if (j > 0) {
            console.log(', ')
          }
          console.log(this.m_enum_to_str[i].get(j))
        }
        console.log('}\n')
      }
    }
    console.log('@DATA\n')
    for (let i = 0; i < this.rows(); i++) {
      const r = this.row(i)
      for (let j = 0; j < r.length; j++) {
        if (j > 0) {
          console.log(', ')
        }
        if (this.valueCount(j) === 0) {
          console.log(r[j])
        } else {
          console.log(this.m_enum_to_str[j].get(r[j]))
        }
      }
      console.log('\n')
    }
  }
}
