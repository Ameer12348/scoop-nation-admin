import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"



type User = {
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
};
type TableData = User[];
type TableHeader = { name: string; value: keyof User }[]


const tableHeaders: TableHeader = [
    {
        name: "Name",     
        value:'name'  
    },
    {
        name: "Email",     
        value:'email'  
    },
    {
        name: "Phone",     
        value:'phone'  
    },
    {
        name: "Address",     
        value:'address'  
    },
    {
        name: "Role",     
        value:'role'  
    },

]
const tableData: TableData = [
    {
        name: "John Doe",     
        email: "john.doe@example.com",     
        phone: "123-456-7890",     
        address: "123 Main St, Anytown, USA",     
        role: "Admin",     
    },
    {
        name: "John Doe",     
        email: "john.doe@example.com",     
        phone: "123-456-7890",     
        address: "123 Main St, Anytown, USA",     
        role: "Admin",     
    },
    {
        name: "John Doe",     
        email: "john.doe@example.com",     
        phone: "123-456-7890",     
        address: "123 Main St, Anytown, USA",     
        role: "Admin",     
    },
]





const UsersDataTable = (/*{name}:any*/) => {


  return (
    <div>
            <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {tableHeaders.map((header) => (
                    <TableCell
                    key={header.value}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((data,index) => (
                <TableRow key={index}>
                  {tableHeaders.map((header) => (
                    <TableCell
                    key={header.value}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {data[header.value]}
                  </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>        
    </div>
  )
}

export default UsersDataTable