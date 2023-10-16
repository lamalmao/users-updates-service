const { z, ZodNumber } = require('zod');
const { getUpdates, countUpdates } = require('../db');

const ListParamsObject = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  id: z.coerce.number().int().min(1).optional()
});

const showUpdatesController = async (req, res) => {
  try {
    const { page, limit, id } = ListParamsObject.parse(req.query);

    const actions = await getUpdates(limit, (page - 1) * limit, id);
    const count = await countUpdates(id);
    const maxPage = Math.ceil(count / limit);

    res.render('updates', {
      actions,
      maxPage,
      page,
      limit,
      id
    });
  } catch (error) {
    res.status(500);
    res.json({ error: 'Internal server error' });
  }
};

module.exports = showUpdatesController;
