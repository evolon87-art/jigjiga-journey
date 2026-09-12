import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Check } from "lucide-react";
import {
  GRUPLAR,
  hocaMailAyarDinle,
  hocaMailleriKaydet,
  aidatMailGonderimIsaretle,
  aidatTutariniOku,
  type HocaMailAyar,
  type Talebe,
} from "@/lib/talebeler";
import { aidatHatirlatmaGonder } from "@/lib/aidatMail.functions";

const AY_ADLARI = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export default function AidatHatirlatma({ talebeler }: { talebeler: Talebe[] }) {
  const simdi = new Date();
  const ayKey = `${simdi.getFullYear()}-${String(simdi.getMonth() + 1).padStart(2, "0")}`;
  const ayEtiket = `${AY_ADLARI[simdi.getMonth()]} ${simdi.getFullYear()}`;

  const [ayar, setAyar] = useState<HocaMailAyar>({ mailler: {}, gonderilen: {} });
  const [taslak, setTaslak] = useState<Record<string, string>>({});
  const [tutar, setTutar] = useState(0);
  const [gonderiliyor, setGonderiliyor] = useState<string | null>(null);

  useEffect(() => {
    const unsub = hocaMailAyarDinle((a) => {
      setAyar(a);
      setTaslak((t) => ({ ...a.mailler, ...t }));
    });
    void aidatTutariniOku().then(setTutar);
    return () => unsub();
  }, []);

  const gonderilenler = ayar.gonderilen[ayKey] ?? [];

  const grupVerisi = useMemo(
    () =>
      GRUPLAR.map((g) => {
        const liste = talebeler.filter((t) => t.grup === g.id);
        const odeyen = liste.filter((t) => t.aidat?.[ayKey]).length;
        return {
          ...g,
          toplam: liste.length,
          odeyen,
          odemeyenler: liste.filter((t) => !t.aidat?.[ayKey]).map((t) => t.isim),
        };
      }),
    [talebeler, ayKey],
  );

  const gonder = async (grupId: string) => {
    const grup = grupVerisi.find((g) => g.id === grupId);
    const eposta = (taslak[grupId] ?? "").trim();
    if (!grup) return;
    if (!eposta) {
      toast.error("Önce hocanın e-posta adresini yazın.");
      return;
    }
    setGonderiliyor(grupId);
    try {
      await hocaMailleriKaydet({ ...ayar.mailler, ...taslak });
      await aidatHatirlatmaGonder({
        data: {
          eposta,
          hocaAdi: grup.hoca,
          grupAdi: grup.ad,
          ayEtiket,
          tutar,
          odeyen: grup.odeyen,
          toplam: grup.toplam,
          odemeyenler: grup.odemeyenler,
        },
      });
      await aidatMailGonderimIsaretle(ayKey, grupId, ayar.gonderilen);
      toast.success(`${grup.hoca} adresine hatırlatma gönderildi.`);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "E-posta gönderilemedi.",
      );
    } finally {
      setGonderiliyor(null);
    }
  };

  const gonderilmeyen = grupVerisi.filter(
    (g) => !gonderilenler.includes(g.id) && (taslak[g.id] ?? "").trim(),
  );

  const hepsineGonder = async () => {
    for (const g of gonderilmeyen) {
      // eslint-disable-next-line no-await-in-loop
      await gonder(g.id);
    }
  };

  return (
    <div className="rounded-md border border-border/60 px-3 py-3">
      <div className="mb-2 flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Aidat Hatırlatma E-postası</span>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        {ayEtiket} ayı için hocalara aidat hatırlatması gönderin.
        {gonderilmeyen.length > 0 && (
          <span className="ml-1 font-medium text-destructive">
            Bu ay {gonderilmeyen.length} hocaya henüz gönderilmedi.
          </span>
        )}
      </p>

      <div className="space-y-3">
        {grupVerisi.map((g) => {
          const gonderildi = gonderilenler.includes(g.id);
          return (
            <div key={g.id} className="rounded-md bg-muted/30 px-2 py-2">
              <Label className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">
                  {g.hoca}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {g.ad} · {g.odeyen}/{g.toplam} ödedi
                  </span>
                </span>
                {gonderildi && (
                  <span className="flex items-center gap-1 text-primary">
                    <Check className="h-3 w-3" /> gönderildi
                  </span>
                )}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  inputMode="email"
                  placeholder="hoca@gmail.com"
                  className="h-9"
                  value={taslak[g.id] ?? ""}
                  onChange={(e) =>
                    setTaslak((t) => ({ ...t, [g.id]: e.target.value }))
                  }
                  onBlur={() =>
                    void hocaMailleriKaydet({ ...ayar.mailler, ...taslak })
                  }
                />
                <Button
                  size="sm"
                  disabled={gonderiliyor === g.id}
                  onClick={() => void gonder(g.id)}
                >
                  <Send className="mr-1 h-3.5 w-3.5" />
                  {gonderiliyor === g.id ? "..." : "Gönder"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        className="mt-3 w-full"
        disabled={!!gonderiliyor || gonderilmeyen.length === 0}
        onClick={() => void hepsineGonder()}
      >
        <Mail className="mr-2 h-4 w-4" />
        Tüm hocalara gönder ({gonderilmeyen.length})
      </Button>
    </div>
  );
}
