import {
  Table,
  TableBody,
  TableCell,
  TableHeader, // Changed from TableHead to TableHeader
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Invoice } from "@/types/Invoice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InvoiceTable = () => {
  const navigate = useNavigate();
  const { invoices } = useAppSelector((state: RootState) => state.invoices);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const currentUser = useAppSelector(
    (state: RootState) => state.user.currentUser
  );

  const getInvoices = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL is not defined");
      return;
    }

    const response = await fetch(`${backendUrl}/api/invoice`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser?.user?._id,
      }),
    });

    const data = await response.json();
    setInvoiceList(data);
  };

  useEffect(() => {
    getInvoices();
  }, [invoices]); // Track invoices directly

  return (
    <>
      {invoiceList.length === 0 ? (
        <div className="flex items-center justify-center h-[34rem] text-md mx-2">
          No Invoices Found!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeader className="w-[100px] text-orange-500 font-bold">Id</TableHeader> {/* Changed TableHead to TableHeader */}
              <TableHeader className="text-center text-orange-500 font-bold">Invoice Name</TableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceList.map((invoice: Invoice, index) => {
              return (
                <TableRow
                  key={index}
                  onClick={() => {
                    navigate(`/${invoice._id}`);
                  }}
                  className={"cursor-pointer"}
                >
                  <TableCell>{invoice._id}</TableCell>
                  <TableCell className="text-center ">
                    {invoice.invoiceName}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default InvoiceTable;
