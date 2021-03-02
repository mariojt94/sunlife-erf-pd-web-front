using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERC.Repository.ViewModel
{
    public class ProcessResultT<T> : ProcessResult
    {
        public T returnValue
        {
            get;
            set;
        }

        public ProcessResultT()
        {
        }

        public ProcessResultT(bool isSucceed, string message)
        {
            base.isSucceed = isSucceed;
            base.message = message;
        }

        public ProcessResultT(bool isSucceed, string message, T returnValue)
        {
            base.isSucceed = isSucceed;
            base.message = message;
            this.returnValue = returnValue;
        }
    }
}
