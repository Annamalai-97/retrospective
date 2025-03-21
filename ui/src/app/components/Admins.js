import React from 'react';
import DataTable from 'react-data-table-component';
import { FaUser } from 'react-icons/fa';

const Admins = () => {
    const customStyles = {
        headRow: { style: { display: "none" } },
        cells:{style:{height:'60px'}}
    };


    const adminData = [
        { id: 1, AdminName: 'Emily Olivia', email: 'emily@123gmail.com', initial: 'E', color: 'bg-teal-300', role: 'Super Admin', rolebg:'bg-orange-300' },
        { id: 2, AdminName: 'Sophia Lily', email: 'sophialilly@123gmail.com', initial: 'S', color: 'bg-orange-300' },
        { id: 3, AdminName: 'Harper Ava', email: 'harper@123gmail.com', initial: 'H', color: 'bg-blue-300' },
        { id: 4, AdminName: 'Victoria', email: 'victoria@123gmail.com', initial: 'V', color: 'bg-purple-300' }
    ];

    const columns = [
           
         

        { selector: (row) => row.id, sortable: true, width: "60px" ,
            cell:(row)=>(
                <div className='text-center'>
                {row.id}
                </div>
            )
        },
        {
        
            selector: (row) => row.AdminName,
            sortable: true,
            cell: (row) => (
                <>
                <div> </div>
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${row.color}`}>
                        {row.initial}
                    </div>
                    <div>
                        <span className="font-medium text-black">{row.AdminName}</span>
                        <p className="text-sm text-gray-500">{row.email}</p>
                    </div>
                </div>
                </>
            ),
        },
        {
            
            selector: (row) => row.role,
            sortable: true,
            width: "150px",
            cell: (row) => (
                <div className={`px-3 py-1 text-sm font-semibold text-orange-700 rounded-lg ${row.rolebg}`}>
                    {row.role}
                </div>
                
            ),
        },
    ];

    return (
        <div className="relative p-3">
             <div className='flex justify-between items-center w-full bg-white border-b'>
              <h1 className="text-xl m-3 flex items-center">
                               <FaUser className="align-middle" />
                               <span className="ml-2 text-lg">Admins</span>
                           </h1>

                           <button className='text-white bg-primary p-1 px-2 text-center rounded-xl'>change super Admin</button>
                           </div>
            <div className="overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={adminData}
                    highlightOnHover
                    customStyles={customStyles}
                    striped
                />
            </div>
        </div>
    );
};

export default Admins;
