import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const RackView = () => {
  const { rackId } = useParams();
  const { token } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rack, setRack] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [rackId]);

  const fetchData = async () => {
    try {
      const [rackRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/racks/${rackId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/racks/${rackId}/products`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRack(rackRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      toast.error('Failed to load rack data');
    } finally {
      setLoading(false);
    }
  };

  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8" data-testid="rack-view-page">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          onClick={() => navigate('/locations-racks')}
          variant="ghost"
          className="mb-4 rounded-full gap-2"
        >
          <ArrowLeft size={20} />
          {t('rackView.backToLocations')}
        </Button>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-stone-500">{t('rackView.loading')}</p>
          </div>
        ) : rack ? (
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{rack.name}</h1>
              <p className="text-stone-600 mb-4">
                {t('rackView.codeLabel')}: <span className="font-mono font-semibold">{rack.code}</span> | {t('rackView.locationLabel')}:{' '}
                <span className="font-semibold">{rack.location_name}</span>
              </p>
              {rack.description && (
                <p className="text-sm text-stone-600 mb-4">{rack.description}</p>
              )}
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-stone-600">{t('rackView.totalProducts')}</p>
                  <p className="text-2xl font-mono font-bold text-primary">{products.length}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-600">{t('rackView.totalUnits')}</p>
                  <p className="text-2xl font-mono font-bold text-primary">{totalQuantity}</p>
                </div>
                {rack.max_capacity && (
                  <div>
                    <p className="text-xs text-stone-600">{t('rackView.capacity')}</p>
                    <p className="text-2xl font-mono font-bold text-primary">{rack.max_capacity}</p>
                  </div>
                )}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-stone-200 rounded-2xl">
                <Package className="mx-auto mb-4 text-stone-400" size={48} />
                <p className="text-stone-600 font-medium">{t('rackView.noProducts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border-2 border-stone-200 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/inventory`)}
                    data-testid={`product-${product.product_id}`}
                  >
                    <h3 className="text-lg font-bold text-primary mb-2">{product.product_name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">{t('rackView.quantity')}</span>
                      <span className="text-2xl font-mono font-bold text-primary">{product.quantity}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-stone-200">
                      <p className="text-xs text-stone-500">
                        {t('rackView.assignedBy')}: {product.assigned_by_name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-600">{t('rackView.rackNotFound')}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RackView;
