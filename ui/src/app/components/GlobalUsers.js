import React from 'react';
import DataTable from 'react-data-table-component';
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import useUsers from '../hooks/UserHooks/useUsers';

const GlobalUsers = () => {
    const { users, loading, error } = useUsers();

    const customStyles = {
        headRow: { style: { display: "none" } },
        cells: { style: { textAlign: "center", justifyContent: "center", height: '60px' } },
        rows: { style: { textAlign: "center" } },
    };

    const handleEditDialog = (row) => {
        console.log('Edit user', row);
    };

    const handleDelete = (id) => {
        console.log('Delete user with ID:', id);
    };

    const mappedUsers = users.map((user, index) => ({
        id: index + 1,
        Username: user.name || user.email || 'Unknown',
        initial: user.name ? user.name.charAt(0).toUpperCase() : 'U',
        color: 'bg-blue-300',
        role: user.role || 'User'
    }));

    const columns = [
        {
            selector: (row) => row.id,
            sortable: true,
            width: "60px",
            cell: (row) => <div className="text-center">{row.id}</div>
        },
        {
            selector: (row) => row.Username,
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2 justify-start w-full">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${row.color}`}>
                        {row.initial}
                    </div>
                    <span className="font-medium text-black">{row.Username}</span>
                </div>
            ),
            wrap: true
        },
        {
            name: "Role / Actions",
            cell: (row) =>
                row.role === 'Super Admin' ? (
                    <div className="px-3 py-1 text-sm font-semibold text-orange-600 rounded-lg bg-orange-200">
                        {row.role}
                    </div>
                ) : (
                    <div className="flex gap-x-3">
                        <button
                            className="text-customDeepBlue hover:text-blue-700 bg-white shadow-lg border p-2 rounded-xl"
                            onClick={() => handleEditDialog(row)}
                        >
                            <BiSolidEdit size={20} />
                        </button>
                        <button
                            className="text-red-500 hover:text-red-700 bg-white shadow-lg border p-2 rounded-xl"
                            onClick={() => handleDelete(row.id)}
                        >
                            <RiDeleteBin6Line size={20} />
                        </button>
                    </div>
                ),
            width: '180px',
        },
    ];

    return (
        <div className="relative p-4">
            <div className='flex justify-between w-full bg-white border-b'>
                <h1 className="text-xl m-3 flex items-center">
                    <FaUser className="align-middle" />
                    <span className="ml-2 text-lg">Global Users</span>
                </h1>
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <p className="text-center py-10">Loading users...</p>
                ) : error ? (
                    <p className="text-center py-10 text-red-500">Error: {error}</p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={mappedUsers}
                        striped
                        customStyles={customStyles}
                        noHeader
                    />
                )}
            </div>
        </div>
    );
};

export default GlobalUsers;
