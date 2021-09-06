import _ from 'lodash'

const columns = [
  { header: 'Name', key: 'name', width: 32 },
  { header: 'Data', key: 'data', width: 15 },
]

const getDetails = (filteredData) => {
  let out = []

  _.forEach(filteredData, (row) => {
    out.push(row)
  })
  return out
}

const processing = { getDetails, columns }
export default processing