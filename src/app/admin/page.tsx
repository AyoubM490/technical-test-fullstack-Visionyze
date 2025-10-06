import { prisma } from "@lib/prisma";
/**
 * TODO:
 * - Lister les paiements (50 derniers) triés par date desc.
 * - Afficher le total des montants (en centimes) en tête
 * - Colonnes: date, montant, devise, statut, session, email
 */

interface Props {
  searchParams?: { page?: string };
}

export default async function AdminPage({ searchParams }: Props) {

  const params = await searchParams;
  
  // Récupère les 50 derniers paiements triés par date décroissante
  const page = parseInt(params?.page || "1", 10);       // numéro de page (1 = première page)
  const pageSize = 50;  // nombre de paiements par page

   // Récupérer le nombre total de paiements pour calculer les pages
  const totalPayments = await prisma.payment.count();
  const totalPages = Math.ceil(totalPayments / pageSize);

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });


  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Dashboard /admin</h2>
        <p className="opacity-70 text-sm">Total: {totalAmount} centimes</p>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Montant</th>
              <th className="p-2">Devise</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Session</th>
              <th className="p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="p-2">{p.createdAt.toLocaleString()}</td>
                <td className="p-2">{(p.amount / 100).toFixed(2)} €</td>
                <td className="p-2">{p.currency}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2 break-all">{p.stripeSessionId}</td>
                <td className="p-2">{p.customerEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between mt-4 items-center">
          {page > 1 ? (
            <a href={`/admin?page=${page - 1}`} className="btn px-3 py-1 rounded">
              ← Précédent
            </a>
          ) : (
            <span />
          )}

          <span>
            Page {page} / {totalPages}
          </span>

          {page < totalPages ? (
            <a href={`/admin?page=${page + 1}`} className="btn px-3 py-1 rounded">
              Suivant →
            </a>
          ) : (
            <span />
          )}
        </div>


      </div>
    </main>
  );
}
