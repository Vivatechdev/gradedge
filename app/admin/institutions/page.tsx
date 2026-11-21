"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Building2,
  Users,
  CreditCard,
  CheckCircle2,
  Download,
  Plus,
  ShieldCheck,
  Search,
  ExternalLink,
  Key,
} from "lucide-react";

interface UniversityContract {
  id: string;
  institutionName: string;
  department: string;
  contractType: "enterprise_lab" | "doctoral_consortium" | "fellowship_voucher";
  allocatedSeats: number;
  activeSeats: number;
  annualValueGbp: number;
  renewalDate: string;
  liaisonName: string;
  liaisonEmail: string;
  status: "active" | "renewal_pending";
}

const INSTITUTIONS: UniversityContract[] = [
  {
    id: "inst-701",
    institutionName: "University of Cambridge",
    department: "Institute of Public Health & Global Health Epidemiology",
    contractType: "doctoral_consortium",
    allocatedSeats: 20,
    activeSeats: 18,
    annualValueGbp: 48000,
    renewalDate: "Oct 2027",
    liaisonName: "Prof. Kenneth Davies",
    liaisonEmail: "k.davies@iph.cam.ac.uk",
    status: "active",
  },
  {
    id: "inst-702",
    institutionName: "Oxford Africa Scholars Doctoral Consortium",
    department: "Faculty of Social Sciences & International Development",
    contractType: "enterprise_lab",
    allocatedSeats: 15,
    activeSeats: 14,
    annualValueGbp: 36000,
    renewalDate: "Jan 2027",
    liaisonName: "Dr. Ngozi Nwosu",
    liaisonEmail: "n.nwosu@qeh.ox.ac.uk",
    status: "active",
  },
  {
    id: "inst-703",
    institutionName: "Wellcome Trust PhD Training Partnership",
    department: "Genomics, Biostatistics & Infectious Disease Informatics",
    contractType: "enterprise_lab",
    allocatedSeats: 25,
    activeSeats: 21,
    annualValueGbp: 62500,
    renewalDate: "Mar 2027",
    liaisonName: "Dr. Sarah Thornton",
    liaisonEmail: "s.thornton@wellcome.ac.uk",
    status: "active",
  },
];

export default function AdminInstitutionsPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInstitutions = INSTITUTIONS.filter((inst) =>
    inst.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalContractValue = INSTITUTIONS.reduce((sum, i) => sum + i.annualValueGbp, 0);
  const totalAllocated = INSTITUTIONS.reduce((sum, i) => sum + i.allocatedSeats, 0);
  const totalActive = INSTITUTIONS.reduce((sum, i) => sum + i.activeSeats, 0);

  const handleGenerateVouchers = (name: string) => {
    showToast(`20 Doctoral Enrollment License Keys generated for ${name}.`, "success");
  };

  const handleDownloadAgreement = (name: string) => {
    showToast(`Master Institutional SLA & Service Agreement (.PDF) for ${name} downloaded.`, "info");
  };

  return (
    <DashboardShell
      role="admin"
      title="Institutional B2B"
      user={{
        id: "admin-1",
        name: "System Administrator",
        email: "admin@gradedge.org",
        institution: "GradEdge Operations",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-tone-rule pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-tone-heading">
              University Labs &amp; Institutional B2B Contracts
            </h2>
            <p className="text-xs text-tone-muted mt-1">
              Enterprise agreements, doctoral consortia seat allocations, and institutional invoicing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast("Institutional Contract Builder modal opened.", "info")}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Partner University
            </Button>
          </div>
        </div>

        {/* 3 Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Annual Recurring Contract Value
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-tone-heading">
                  £{totalContractValue.toLocaleString()}
                </span>
                <CreditCard className="w-5 h-5 text-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Across 3 multi-year doctoral institutional partnerships
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Institutional Doctoral Seats
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-navy">
                  {totalActive} / {totalAllocated} Active
                </span>
                <Users className="w-5 h-5 text-navy" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-emerald-700 font-sans font-medium">
                88.3% seat utilization rate
              </span>
            </CardContent>
          </Card>

          <Card className="bg-white border-tone-rule">
            <CardHeader className="pb-1">
              <span className="type-micro uppercase text-tone-muted tracking-wider">
                Compliance &amp; Ethics Accreditation
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-2xl font-bold text-emerald-700">
                  Certified
                </span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <span className="text-[11px] text-stone-500 font-sans">
                Fully compliant with UKRI and Bodleian guidelines
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Institutions Table */}
        <Card className="bg-white border-tone-rule">
          <CardHeader className="border-b border-tone-rule pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="font-serif text-base text-tone-heading">
                  Partner Universities &amp; Doctoral Consortia
                </CardTitle>
                <p className="text-xs text-stone-500 font-sans">
                  Institutional accounts receive dedicated doctoral cohorts and monthly faculty progress summaries.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs bg-paper border border-stone-200 rounded-[2px] focus:outline-hidden focus:border-gold"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs font-sans text-left">
              <thead className="bg-paper border-b border-tone-rule text-stone-500 uppercase tracking-wide text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Institution &amp; Department</th>
                  <th className="py-3 px-4 font-semibold text-center">Seats</th>
                  <th className="py-3 px-4 font-semibold">Academic Liaison</th>
                  <th className="py-3 px-4 font-semibold text-right">Annual Value</th>
                  <th className="py-3 px-4 font-semibold text-right">Renewal</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tone-rule">
                {filteredInstitutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-paper/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-tone-heading block font-serif text-sm">
                        {inst.institutionName}
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        {inst.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-navy">
                        {inst.activeSeats} / {inst.allocatedSeats}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{inst.liaisonName}</div>
                      <span className="text-[10px] text-stone-400">{inst.liaisonEmail}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-stone-900">
                      £{inst.annualValueGbp.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-stone-700">
                      {inst.renewalDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateVouchers(inst.institutionName)}
                        >
                          <Key className="w-3.5 h-3.5 mr-1" />
                          Keys
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadAgreement(inst.institutionName)}
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          SLA
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

