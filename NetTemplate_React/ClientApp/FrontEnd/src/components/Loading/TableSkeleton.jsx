import { Skeleton, Table } from "@mantine/core";

const TableSkeleton = ({ rows = 5, cols = 3 }) => {

  const rowsArray = Array(rows).fill(0);
  const colsArray = Array(cols).fill(0);

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {colsArray.map((_, index) => (
            <Table.Th key={`header-${index}`}>
              <Skeleton h={30} />
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rowsArray.map((_, rowIndex) => (
          <Table.Tr key={`row-${rowIndex}`}>
            {colsArray.map((_, colIndex) => (
              <Table.Td key={`cell-${rowIndex}-${colIndex}`}>
                <Skeleton h={50} />
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>

    </Table>
  )

}

export default TableSkeleton;
